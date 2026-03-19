<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

// Rate limiting
session_start();
$ip = $_SERVER['REMOTE_ADDR'];
$rateLimit = 10; // requests per hour
$timeWindow = 3600; // 1 hour in seconds

if (isset($_SESSION['requests'][$ip])) {
    $requests = $_SESSION['requests'][$ip];
    $requests = array_filter($requests, function($timestamp) use ($timeWindow) {
        return $timestamp > time() - $timeWindow;
    });
    
    if (count($requests) >= $rateLimit) {
        http_response_code(429);
        echo json_encode(['error' => 'Rate limit exceeded. Please try again later.']);
        exit;
    }
    
    $requests[] = time();
    $_SESSION['requests'][$ip] = $requests;
} else {
    $_SESSION['requests'][$ip] = [time()];
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['image'])) {
    $file = $_FILES['image'];
    
    // Validate file
    $allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    $maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!in_array($file['type'], $allowedTypes)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid file type. Please upload JPG or PNG.']);
        exit;
    }
    
    if ($file['size'] > $maxSize) {
        http_response_code(400);
        echo json_encode(['error' => 'File too large. Maximum size is 5MB.']);
        exit;
    }
    
    // Create uploads directory if it doesn't exist
    $uploadDir = '../uploads/';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }
    
    // Generate unique filename
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid() . '.' . $extension;
    $filepath = $uploadDir . $filename;
    
    // Move uploaded file
    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        // Process image (simplified - in production you'd use a proper API)
        $processedPath = processBackgroundRemoval($filepath);
        
        if ($processedPath) {
            // Save to database
            saveToDatabase($filename, $file['name']);
            
            // Return processed image
            header('Content-Type: image/png');
            readfile($processedPath);
            
            // Clean up old files
            cleanupOldFiles($uploadDir, 3600); // Remove files older than 1 hour
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to process image.']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to upload file.']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}

function processBackgroundRemoval($imagePath) {
    // This is a simplified version
    // In production, you would integrate with a service like remove.bg API
    // or use a library like OpenCV
    
    $imagick = new Imagick($imagePath);
    
    // Simple background removal simulation
    // In reality, you'd use AI/ML for this
    $imagick->transparentPaintImage('white', 0, 10);
    
    $outputPath = str_replace('.' . pathinfo($imagePath, PATHINFO_EXTENSION), '_processed.png', $imagePath);
    $imagick->setImageFormat('png');
    $imagick->writeImage($outputPath);
    $imagick->clear();
    
    return $outputPath;
}

function saveToDatabase($filename, $originalName) {
    $conn = getDatabaseConnection();
    if ($conn) {
        $stmt = $conn->prepare("INSERT INTO processed_images (filename, original_name, ip_address, created_at) VALUES (?, ?, ?, NOW())");
        $ip = $_SERVER['REMOTE_ADDR'];
        $stmt->bind_param("sss", $filename, $originalName, $ip);
        $stmt->execute();
        $stmt->close();
        $conn->close();
    }
}

function cleanupOldFiles($dir, $maxAge) {
    $files = glob($dir . '*');
    $now = time();
    
    foreach ($files as $file) {
        if (is_file($file) && ($now - filemtime($file)) > $maxAge) {
            unlink($file);
        }
    }
}
?>