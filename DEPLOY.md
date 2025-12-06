# Deployment Instructions

## GitHub Authentication Issue

If you're getting a "Permission denied" error, you need to authenticate with GitHub. Here are the options:

### Option 1: Use Personal Access Token (Recommended)

1. **Create a Personal Access Token:**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Give it a name like "Retail Sales Management"
   - Select scopes: `repo` (full control of private repositories)
   - Click "Generate token"
   - **Copy the token immediately** (you won't see it again!)

2. **Push using the token:**
   ```bash
   git push https://YOUR_TOKEN@github.com/Arjavv172004/Retail-Sales-Management.git main
   ```
   Replace `YOUR_TOKEN` with your actual token.

### Option 2: Use SSH (More Secure)

1. **Set up SSH key** (if not already done):
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. **Add SSH key to GitHub:**
   - Copy your public key: `cat ~/.ssh/id_ed25519.pub`
   - Go to: https://github.com/settings/keys
   - Click "New SSH key"
   - Paste your key and save

3. **Update remote URL:**
   ```bash
   git remote set-url origin git@github.com:Arjavv172004/Retail-Sales-Management.git
   git push -u origin main
   ```

### Option 3: Update Git Credentials

```bash
git config --global user.name "Arjavv172004"
git config --global user.email "your-email@example.com"
```

Then try pushing again.

## After Successful Push

Your repository will be available at:
**https://github.com/Arjavv172004/Retail-Sales-Management**

## Important Notes

- The CSV file (`truestate_assignment_dataset.csv`) is **NOT** included in the repository (it's in `.gitignore` due to its large size)
- Users will need to add their own CSV file to the project root
- All code, documentation, and configuration files are included

