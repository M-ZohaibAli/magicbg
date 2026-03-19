<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = filter_var($_POST['name'] ?? '', FILTER_SANITIZE_STRING);
    $email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $subject = filter_var($_POST['subject'] ?? '', FILTER_SANITIZE_STRING);
    $message = filter_var($_POST['message'] ?? '', FILTER_SANITIZE_STRING);
    
    // Validate
    $errors = [];
    
    if (empty($name)) {
        $errors[] = 'Name is required';
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Valid email is required';
    }
    
    if (empty($subject)) {
        $errors[] = 'Subject is required';
    }
    
    if (empty($message)) {
        $errors[] = 'Message is required';
    }
    
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(['errors' => $errors]);
        exit;
    }
    
    // Save to database
    $conn = getDatabaseConnection();
    if ($conn) {
        $stmt = $conn->prepare("INSERT INTO contact_messages (name, email, subject, message, ip_address, created_at) VALUES (?, ?, ?, ?, ?, NOW())");
        $ip = $_SERVER['REMOTE_ADDR'];
        $stmt->bind_param("sssss", $name, $email, $subject, $message, $ip);
        
        if ($stmt->execute()) {
            // Send email notification (optional)
            sendEmailNotification($name, $email, $subject, $message);
            
            echo json_encode(['success' => true, 'message' => 'Message sent successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to save message']);
        }
        
        $stmt->close();
        $conn->close();
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}

function sendEmailNotification($name, $email, $subject, $message) {
    $to = "codeoxideofficial@gmail.com";
    $headers = "From: " . $email . "\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    
    $emailSubject = "New Contact Form Submission: " . $subject;
    
    $emailBody = "
    <html>
    <body>
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> {$name}</p>
        <p><strong>Email:</strong> {$email}</p>
        <p><strong>Subject:</strong> {$subject}</p>
        <p><strong>Message:</strong></p>
        <p>{$message}</p>
    </body>
    </html>
    ";
    
    mail($to, $emailSubject, $emailBody, $headers);
}
?>