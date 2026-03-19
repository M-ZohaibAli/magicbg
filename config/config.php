<?php
function getDatabaseConnection() {
    $host = getenv('DB_HOST') ?: 'localhost';
    $username = getenv('DB_USER') ?: 'root';
    $password = getenv('DB_PASS') ?: '';
    $database = getenv('DB_NAME') ?: 'magicbg';
    
    $conn = new mysqli($host, $username, $password, $database);
    
    if ($conn->connect_error) {
        error_log("Database connection failed: " . $conn->connect_error);
        return null;
    }
    
    return $conn;
}

// Create tables if they don't exist
function initializeDatabase() {
    $conn = getDatabaseConnection();
    if (!$conn) return false;
    
    $sql = "
    CREATE TABLE IF NOT EXISTS processed_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        ip_address VARCHAR(45),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_created_at (created_at)
    );
    
    CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        subject VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        ip_address VARCHAR(45),
        status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_created_at (created_at)
    );
    
    CREATE TABLE IF NOT EXISTS api_usage (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ip_address VARCHAR(45) NOT NULL,
        endpoint VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_ip_created (ip_address, created_at)
    );
    ";
    
    if ($conn->multi_query($sql)) {
        do {
            if ($result = $conn->store_result()) {
                $result->free();
            }
        } while ($conn->next_result());
    }
    
    $conn->close();
    return true;
}

// Initialize database on first run
initializeDatabase();
?>