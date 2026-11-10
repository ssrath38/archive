# JSON Web Tokens (JWT)

## What is JWT?

- JWT are open industry standard method for representing claims securely between two parties.
- JWT is stateless.

## How is a JWT structured?

- JWT is a string, it has 3 components separated by dots ( . )

  `[header].[payload].[signature]`

  `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`

  ### Header

  The header typically consists of two parts: the type of the token, which is JWT, and the signing algorithm being used, such as HMAC SHA256 or RSA.

  ```json
  {
    "typ": "JWT",
    "alg": "HS256"
  }
  ```

  ### Payload

  The payload contains claims, which are statements about an entity (typically, the user) and additional data. There are three types of claims: registered, public, and private claims.

  - Registered claims are predefined and include information like `iss` (issuer), `exp` (expiration time), `sub` (subject), and more.
  - Public claims are defined by the JWT standard but not mandatory, and they are meant to be used in the same way as registered claims. However, you should be cautious about their usage to avoid conflicts with others.
  - Private claims are custom claims that are agreed upon between the parties involved. They should be defined in the context of your application.

  ```json
  {
    "userId": "b07f85be-45da",
    "iss": "https://provider.domain.com/",
    "sub": "auth/some-hash-here",
    "exp": 153452683
  }
  ```

  ### Signature

  To create the signature part you have to take the encoded header, encoded payload, a secret, and the algorithm specified in the header and sign that.

  ```
  HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  your-256-bit-secret
  ) secret base64 encoded
  ```

## How Does a JWT Work?

To better understand JWTs, let’s break down their workings with a real-life analogy. Imagine you’re at a club that uses hand stamps for entry and exit. These stamps are special because they are not easy to duplicate. The club’s bouncer, the ‘Verifier,’ uses these stamps to verify your identity.

- Stamp Creation: When you enter the club, the bouncer checks your ID, then uses a special stamp (the ‘Signature’) to mark your hand. The stamp contains the club’s logo and the current date and time.

- Hand Stamp: This stamped hand is like the ‘Payload’ in a JWT. It contains information about your identity (the club’s member) and the timestamp.

- Hand Check: When you leave the club and want to re-enter, the bouncer checks your stamped hand. They match the club’s logo, and if the timestamp is still valid (within the entry time frame), you’re allowed in. This is the ‘Verification’ process, just like the JWT’s ‘Signature’ and ‘Payload’ being verified.

- Security: The stamped hand is hard to duplicate, much like the JWT’s ‘Signature.’ As long as the stamp is valid, the bouncer trusts you to be a club member. If someone tries to change the stamp, the bouncer can easily tell it’s a fake.

## Real-Life JWT Examples

1. **User Authentication**

   JWTs are commonly used for user authentication in web applications. When a user logs in, the server creates a JWT token and sends it back to the client. The client then includes this token in subsequent requests to access protected resources. Here’s how it works:

   Scenario: You’re building a social media application where users can create and share posts. You want to ensure that only logged-in users can create posts.

   Implementation:

   1. User Login: When a user logs in, the server generates a JWT containing the user’s ID and some other claims. This JWT is then sent to the client.

   2. JWT Usage: The client stores the JWT securely (usually in a cookie or local storage). When the user creates a post, the client includes the JWT in the request headers.

   3. Server Validation: The server receives the request and validates the JWT. It checks the signature to ensure it hasn’t been tampered with and that it’s not expired. If everything checks out, the server knows the user is authenticated and allows them to create the post.

   4. User Logout: When the user logs out or the JWT expires, the client discards the token. This ensures that even if an attacker gets hold of the expired token, they can’t use it to perform actions on behalf of the user.

2. **Single Sign-On (SSO)**

   JWTs are also used in Single Sign-On systems, where a user can access multiple applications using a single set of credentials. Let’s consider a corporate environment where employees can access various internal tools.

   Scenario: In your organization, you have multiple internal tools like email, project management, and HR systems. You want to implement Single Sign-On to streamline access for your employees.

   Implementation:

   1. Login to SSO Provider: When an employee logs in to the SSO portal, the SSO provider authenticates them and generates a JWT containing their user information.

   2. Accessing Internal Tools: Now, when the employee accesses any internal tool, the SSO provider includes the JWT in the request to that tool.

   3. Tool Verification: Each tool independently verifies the JWT. If the signature is valid and the claims indicate that the user is authorized to access the tool, the user is allowed in.

   This simplifies the user experience by eliminating the need for multiple logins and ensures that the user is authenticated across different applications within the organization.

3. **Reset Password Links**

   JWTs are also handy when creating reset password links that expire after a certain time. Consider the following example:

   Scenario: In your email application, a user requests a password reset link. You want to ensure the link is only valid for a limited time.

   Implementation:

   1. Request for Password Reset: When the user requests a password reset, your server generates a JWT containing the user’s ID and an expiration time (e.g., one hour in the future). This JWT is sent in a link to the user’s email.

   2. Link Verification: When the user clicks the reset password link, the server validates the JWT. It checks the expiration time and the signature. If the JWT is valid and within the time limit, the user is allowed to reset their password.

   3. Security and Expiry: This mechanism ensures that the password reset link is secure and that it becomes invalid after the specified time.

## How do you securely store a JWT on the clientside?

- localStorage (XSS attack)-> not secure
- sessionStorage (XSS attack)-> not secure
- **httpOnly cookie** -> This is a special kind of cookie that’s only sent in HTTP requests to the server. Storing them in cookies with the `HttpOnly` and `Secure` flags set is a recommended practice.

## How can you invalidate a JWT?

- Token expire
- Referesh token

## Security Concerns

- Token Storage
  - JWTs should be stored securely on the client side. Storing them in cookies with the `HttpOnly` and `Secure` flags set is a recommended practice. This makes it harder for malicious scripts to access the token.
- Token Expiry
  - Tokens should have a limited lifespan. The `exp` (expiration time) claim helps mitigate the risk of an attacker obtaining a token with indefinite validity.
- Token Revocation
  - If a JWT is compromised or a user logs out, there should be mechanisms in place to invalidate or revoke the token. Token revocation lists (blacklists) can be used for this purpose.
- Payload Size
  - Keep the payload of the JWT small. Larger payloads increase the size of each request, which can impact performance. Sensitive data is best stored on the server side.
- Secret Management
  - The secret used to sign tokens (in HMAC algorithms) or the public key (in RSA algorithms) should be kept secret and securely managed. Leaking this secret could lead to security breaches.
- Algorithm Choice
  - Choose a secure signing algorithm. HMAC SHA256 or RSA are common choices. Avoid insecure algorithms, and stay updated on best practices.

# Authentication vs Authorization

- Authentication
  - Authentication is the method of verifying the identity of a consumer or system to ensure they are who they claim to be. It involves checking credentials which include usernames, passwords, or biometric information like fingerprints or facial recognition.
  - Popular Authentication Techniques-
    - Password-Based Authentication
    - Passwordless Authentication
    - 2FA/MFA (Two-Factor Authentication / Multi-Factor Authentication)
    - Single sign-on (SSO)
    - Social authentication
  - The OpenID Connect (OIDC) protocol is an authentication protocol that is generally in charge of user authentication process.
- Authorization
  - Authorization is the method of figuring out and granting permissions to a demonstrated user or system, specifying what assets they can access and what actions they are allowed to carry out. It comes after authentication and guarantees that the authenticated entity has the proper rights to use certain data, applications, or services.
  - Popular Authorization Techniques-
    - Role-Based Access Controls (RBAC)
    - JSON web token (JWT) Authorization
    - SAML Authorization
    - OpenID Authorization
    - OAuth 2.0 Authorization
  - The OAuth 2.0 protocol governs the overall system of user authorization process.

# JWT vs Sessions

- Session Cookies
  - Pros: Centralized, reliable, and secure; easy to revoke access by modifying session records.
  - Cons: Requires server-side storage and database lookups, leading to latency at scale.
  - Best For: Applications with sensitive data requiring real-time revocation and strong security.
  - Example: Banking and Financial Applications, Healthcare Platforms, Government or Legal Systems
- JWTs
  - Pros: Stateless, reduces server load, and allows for faster, client-side validation. Ideal for external APIs and distributed systems.
  - Cons: Hard to revoke or update; relies on expiration for security.
  - Best For: High-performance apps with minimal need for immediate token invalidation.
  - Example: E-Commerce Websites, Social Media Platforms, IoT and Device Authentication

# Stateless vs Statefull

- Stateless Protocols
  - Stateless Protocols are the type of network protocols in which the Client sends a request to the server and the server responds back according to the current state. It does not require the server to retain session information or status about each communicating partner for multiple requests.
  - HTTP (Hypertext Transfer Protocol), UDP (User Datagram Protocol), and DNS (Domain Name System) are examples of Stateless Protocols.
  - Salient Features of Stateless Protocols
    - Stateless Protocol simplifies the design of the Server.
    - The stateless protocol requires fewer resources because the system does not need to keep track of the multiple link communications and the session details.
    - In Stateless Protocol each information packet travels on its own without reference to any other packet.
    - Each communication in Stateless Protocol is discrete and unrelated to those that precedes or follow.
- Stateful Protocol
  - In Stateful Protocol If client send a request to the server then it expects some kind of response, if it does not get any response then it resend the request. FTP (File Transfer Protocol), TCP, and Telnet are the example of Stateful Protocol.
  - Salient Features of Stateful Protocol
    - Stateful Protocols provide better performance to the client by keeping track of the connection information.
    - Stateful Application require Backing storage.
    - Stateful request are always dependent on the server-side state.
    - TCP session follow stateful protocol because both systems maintain information about the session itself during its life.
