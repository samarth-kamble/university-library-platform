const WelcomeEmailTemplate = (fullName: string): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BookWise - Welcome Email</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #1a1f2e;
            color: #ffffff;
            line-height: 1.6;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #1a1f2e;
            padding: 40px 50px;
        }
        
        .logo-section {
            display: flex;
            align-items: center;
            margin-bottom: 60px;
            padding-bottom: 30px;
            border-bottom: 1px solid #2a3042;
        }
        
        .logo {
            width: 40px;
            height: 40px;
            margin-right: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            font-size: 24px;
            color: #1a1f2e;
            font-weight: bold;
        }
        
        .brand-name {
            font-size: 32px;
            font-weight: 400;
            color: #ffffff;
            letter-spacing: -0.5px;
        }
        
        .main-heading {
            font-size: 42px;
            font-weight: 600;
            line-height: 1.2;
            margin-bottom: 40px;
            color: #ffffff;
        }
        
        .greeting {
            font-size: 18px;
            color: #b0b8c4;
            margin-bottom: 30px;
        }
        
        .welcome-text {
            font-size: 18px;
            color: #b0b8c4;
            line-height: 1.7;
            margin-bottom: 40px;
        }
        
        .cta-section {
            margin-bottom: 50px;
        }
        
        .cta-text {
            font-size: 18px;
            color: #b0b8c4;
            margin-bottom: 25px;
        }
        
        .login-button {
            background-color: #d4a574;
            color: #1a1f2e;
            padding: 15px 30px;
            border: none;
            border-radius: 8px;
            font-size: 18px;
            font-weight: 500;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            transition: background-color 0.3s ease;
        }
        
        .login-button:hover {
            background-color: #c19660;
        }
        
        .footer {
            margin-top: 50px;
        }
        
        .footer p {
            font-size: 18px;
            color: #b0b8c4;
            margin-bottom: 5px;
        }
        
        @media (max-width: 640px) {
            .email-container {
                padding: 30px 25px;
            }
            
            .main-heading {
                font-size: 32px;
            }
            
            .brand-name {
                font-size: 28px;
            }
            
            .welcome-text, .cta-text, .greeting {
                font-size: 16px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Logo Section -->
        <div class="logo-section">
            <div class="logo">
              <svg width="40" height="32" viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path opacity="0.5" d="M20 9.99988V31.8888C29.8889 26.4443 38.2223 29.9999 40 31.9999V9.99987C33 5.99986 21.8148 6.62951 20 9.99988Z" fill="#DBE5FF"/>
<path d="M20 10.0001V31.889C26.3333 23.6668 34.3334 25.6668 36.8889 26.1112V4.33343C31 2.44453 21.8148 6.62973 20 10.0001Z" fill="#F0F4FF"/>
<path d="M20 9.74947V31.5556C23.4089 23.6965 32.4261 22.9217 34.2222 23.0324V0.00865083C29.9996 -0.257008 20.8797 5.65389 20 9.74947Z" fill="url(#paint0_linear_5984_2811)"/>
<path opacity="0.5" d="M20 9.99988V31.8888C10.1111 26.4443 1.77775 29.9999 -3.43323e-05 31.9999V9.99987C6.99998 5.99986 18.1852 6.62951 20 9.99988Z" fill="#DBE5FF"/>
<path d="M20 10.0001V31.889C13.6667 23.6668 5.66664 25.6668 3.11108 26.1112V4.33343C8.99998 2.44453 18.1852 6.62973 20 10.0001Z" fill="#F0F4FF"/>
<path d="M20 9.74947V31.5556C16.5911 23.6965 7.57386 22.9217 5.77775 23.0324V0.00865083C10.0004 -0.257008 19.1203 5.65389 20 9.74947Z" fill="url(#paint1_linear_5984_2811)"/>
<defs>
<linearGradient id="paint0_linear_5984_2811" x1="20" y1="18.7778" x2="34.2222" y2="18.7778" gradientUnits="userSpaceOnUse">
<stop stop-color="#FAFBFF" stop-opacity="0.49"/>
<stop offset="1" stop-color="#FAFBFF"/>
</linearGradient>
<linearGradient id="paint1_linear_5984_2811" x1="20" y1="18.7778" x2="5.77775" y2="18.7778" gradientUnits="userSpaceOnUse">
<stop stop-color="#FAFBFF" stop-opacity="0.49"/>
<stop offset="1" stop-color="#FAFBFF"/>
</linearGradient>
</defs>
</svg>
            </div>
            <div class="brand-name">BookWise</div>
        </div>
        
        <!-- Main Content -->
        <h1 class="main-heading">Welcome to BookWise, Your Reading Companion!</h1>
        
        <p class="greeting">Hi ${fullName},</p>
        
        <p class="welcome-text">
            Welcome to BookWise! We're excited to have you join our community of book enthusiasts. Explore a wide range of books, borrow with ease, and manage your reading journey seamlessly.
        </p>
        
        <!-- Call to Action Section -->
        <div class="cta-section">
            <p class="cta-text">Get started by logging in to your account:</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://your-app-url.com"}/login" class="login-button">Login to BookWise</a>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p>Happy reading,</p>
            <p>The BookWise Team</p>
        </div>
    </div>
</body>
</html>
  `;
};

export default WelcomeEmailTemplate;
