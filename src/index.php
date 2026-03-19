<?php
// Main entry point - serves the React application
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MagicBG - Remove Backgrounds in Seconds</title>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    
    <!-- Animate.css -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
    
    <!-- Custom CSS -->
    <link rel="stylesheet" href="/src/App.css">
    
    <!-- Favicon -->
    <link rel="icon" href="https://via.placeholder.com/50" type="image/x-icon">
    
    <!-- MediaPipe for background removal -->
    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"></script>
</head>
<body>
    <div id="root"></div>

    <!-- React and dependencies -->
    <script src="https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@babel/standalone@7.23.5/babel.min.js"></script>
    
    <!-- Firebase -->
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js"></script>
    
    <!-- Main App -->
    <script type="text/babel" src="/src/App.jsx"></script>
    
    <script type="text/babel">
        // Initialize Firebase
        const firebaseConfig = {
            apiKey: "<?php echo getenv('FIREBASE_API_KEY') ?: 'YOUR_API_KEY'; ?>",
            authDomain: "<?php echo getenv('FIREBASE_AUTH_DOMAIN') ?: 'YOUR_AUTH_DOMAIN'; ?>",
            databaseURL: "<?php echo getenv('FIREBASE_DATABASE_URL') ?: 'YOUR_DATABASE_URL'; ?>",
            projectId: "<?php echo getenv('FIREBASE_PROJECT_ID') ?: 'YOUR_PROJECT_ID'; ?>",
            storageBucket: "<?php echo getenv('FIREBASE_STORAGE_BUCKET') ?: 'YOUR_STORAGE_BUCKET'; ?>",
            messagingSenderId: "<?php echo getenv('FIREBASE_MESSAGING_SENDER_ID') ?: 'YOUR_MESSAGING_SENDER_ID'; ?>",
            appId: "<?php echo getenv('FIREBASE_APP_ID') ?: 'YOUR_APP_ID'; ?>"
        };

        firebase.initializeApp(firebaseConfig);
        window.database = firebase.database();

        // Render React App
        ReactDOM.render(
            <App />,
            document.getElementById('root')
        );
    </script>
</body>
</html>