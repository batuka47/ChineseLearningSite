# Switch Git to Your Account

## 1. Set your Git identity (for commits)

Run these in Terminal (replace with your name and email):

```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

To set only for this project:

```bash
cd /Users/batuka/Documents/chinese-word-learning-app
git config user.name "Your Name"
git config user.email "your-email@example.com"
```

## 2. Log out the other person's GitHub account

### Option A: Remove stored credentials (macOS)

Git often stores credentials in Keychain. Clear them so you get a fresh login:

1. Open **Keychain Access** (Spotlight → "Keychain Access").
2. Search for **github.com**.
3. Delete any "github.com" internet password entries.
4. Next time you `git push` or `git pull`, you'll be asked to sign in — use **your** account.

From Terminal you can also do:

```bash
git credential-osxkeychain erase
host=github.com
protocol=https
```
(Press Enter twice after the last line.)

### Option B: Sign out in browser

If you use GitHub in the browser:

1. Go to https://github.com
2. Profile (top right) → **Sign out**
3. Sign in with your account
4. When Git prompts for login, use your GitHub username and a **Personal Access Token** (not your password — see GitHub Settings → Developer settings → Personal access tokens).

## 3. Confirm

```bash
git config user.name
git config user.email
```

Then try:

```bash
git fetch origin
```

You should be prompted to authenticate — use your GitHub account (and token if you use one).
