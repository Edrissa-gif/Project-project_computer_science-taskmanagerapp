 Task Manager Application

## Technology Stack

Frontend: React.js, Vite, Tailwind CSS
Backend: Node.js, Express.js
Database: MongoDB Atlas
Authentication: JSON Web Tokens (JWT), bcrypt

---

## 📂 Repository Structure

```
project-root/
│
├── backend/        # API, routes, models, controllers, .env files
├── frontend/       # React client interface
├── README.md       # Documentation (this file)
└── .gitignore      

##  Installation and Usage

### Step 1: Clone the Repository

Open Git Bash or your terminal and run:

```bash
git clone https://github.com/Edrissa-gif/Project-project_computer_science-taskmanagerapp.git
cd Project-project_computer_science-taskmanagerapp

 # Step 2: Backend Setup

1. Navigate to the backend folder:

   ```bash
   cd backend
   npm install
   ```

3. Start the backend server:

   ```bash
   npm start
   ```

   You should see:

   ```
   Server started on http://localhost:4000
   DB Connected
# Step 3: Frontend Setup

1. Open a new terminal, then go to the frontend folder:

   ```bash
   cd ../frontend
   npm install
   ```

2. Start the frontend development server:

   ```bash
   npm run dev
   ```

3. Copy the local URL shown in the terminal (usually `http://localhost:5173`) and open it in your browser.

# Step 4: Using the Application

1. Register a new user account.
2. Log in with your credentials.
3. Access the dashboard to:

   * Add new tasks
   * Update existing tasks
   * Mark tasks as completed
   * Delete tasks
4. Log out securely to end your session.




