# Contributing Guidelines

Thank you for your interest in contributing to CalFit!

---

##  Getting Started

1. Fork the repository  
2. Clone your fork  

git clone https://github.com/your-username/CalFit.git

cd CalFit

3. Install dependencies  

npm install

4. Start the app  

npx expo start

---

##  Branching Strategy

- main → stable production code  
- feature/* → new features  
- fix/* → bug fixes  

Example:

git checkout -b fix/dashboard-refresh

---

##  Coding Guidelines

- Keep code simple and readable  
- Use consistent naming (snake_case for DB, camelCase for JS)  
- Avoid hardcoded values (use config/env)  
- Add comments only where necessary  

---

##  Before Submitting

Make sure:

- App runs without errors  
- npx tsc --noEmit passes  
- No unnecessary console logs  
- Feature works end-to-end  

---

##  Submitting Changes

1. Commit changes  

git commit -m "fix: describe your change clearly"

2. Push to your branch  

git push origin your-branch-name

3. Create a Pull Request  

---

## ⚠️ Notes

- Do not commit .env files  
- Do not expose API keys  
- Keep changes focused and minimal  

---

##  Suggestions

For major changes, open an issue first to discuss the approach.

---

Thanks for contributing 🚀
