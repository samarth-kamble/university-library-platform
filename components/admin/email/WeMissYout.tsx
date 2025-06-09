import config from "@/lib/config";
const WeMissYouEmailTemplate = (fullName: string): string => {
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>We Miss You at BookWise!</title>
          <style>
              body {
                  margin: 0;
                  padding: 0;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                  background-color: #f5f5f5;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #1a202c;
                  color: #ffffff;
                  border-radius: 12px;
                  overflow: hidden;
                  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
              }
              .header {
                  padding: 40px 40px 20px 40px;
                  text-align: left;
              }
              .logo {
                  display: flex;
                  align-items: center;
                  margin-bottom: 40px;
              }
              .logo-icon {
                  width: 32px;
                  height: 32px;
                  background-color: #ffffff;
                  border-radius: 6px;
                  margin-right: 12px;
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 18px;
                  font-weight: bold;
                  color: #1a202c;
              }
              .logo-text {
                  font-size: 24px;
                  font-weight: 600;
                  color: #ffffff;
              }
              .content {
                  padding: 0 40px;
                  line-height: 1.6;
              }
              .title {
                  font-size: 32px;
                  font-weight: 700;
                  margin-bottom: 30px;
                  color: #ffffff;
              }
              .greeting {
                  font-size: 18px;
                  color: #a0aec0;
                  margin-bottom: 25px;
              }
              .message {
                  font-size: 16px;
                  color: #e2e8f0;
                  margin-bottom: 30px;
                  line-height: 1.7;
              }
              .cta-section {
                  margin: 40px 0;
              }
              .cta-text {
                  font-size: 16px;
                  color: #e2e8f0;
                  margin-bottom: 25px;
              }
              .cta-button {
                  display: inline-block;
                  background-color: #d69e2e;
                  color: #1a202c;
                  text-decoration: none;
                  padding: 16px 32px;
                  border-radius: 8px;
                  font-weight: 600;
                  font-size: 16px;
                  transition: background-color 0.2s ease;
              }
              .cta-button:hover {
                  background-color: #b7791f;
              }
              .footer {
                  padding: 40px;
                  margin-top: 20px;
              }
              .sign-off {
                  font-size: 16px;
                  color: #e2e8f0;
                  line-height: 1.5;
              }
              .team-name {
                  color: #e2e8f0;
                  font-weight: 500;
              }
              
              /* Responsive styles */
              @media (max-width: 600px) {
                  .container {
                      margin: 10px;
                      border-radius: 8px;
                  }
                  .header, .content, .footer {
                      padding: 30px 20px;
                  }
                  .title {
                      font-size: 28px;
                  }
                  .greeting {
                      font-size: 16px;
                  }
                  .message, .cta-text {
                      font-size: 15px;
                  }
                  .cta-button {
                      padding: 14px 28px;
                      font-size: 15px;
                  }
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <div class="logo">
                      <div class="logo-icon">
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
                      <div class="logo-text">BookWise</div>
                  </div>
                  
                  <h1 class="title">We Miss You at BookWise!</h1>
                  
                  <div class="greeting">Hi ${fullName},</div>
              </div>
              
              <div class="content">
                  <div class="message">
                      It's been a while since we last saw you—over three days, to be exact! New books are waiting for you, and your next great read might just be a click away.
                  </div>
                  
                  <div class="cta-section">
                      <div class="cta-text">Come back and explore now:</div>
                      <a href="${config.env.prodApiEndpoint || "https://bookwise.com"}" class="cta-button">
                          Explore Books on BookWise
                      </a>
                  </div>
              </div>
              
              <div class="footer">
                  <div class="sign-off">
                      See you soon,<br>
                      <span class="team-name">The BookWise Team</span>
                  </div>
              </div>
          </div>
      </body>
      </html>
    `;
};

export default WeMissYouEmailTemplate;
