# Discord Webhook Setup Instructions

## ნაბიჯები Discord ნოთიფიკაციების დასაყენებლად

### 1. Discord Webhook-ის შექმნა

1. გახსენი Discord სერვერი სადაც გინდა რომ მივიდეს ნოთიფიკაციები
2. გადადი იმ არხზე (channel) სადაც გინდა რომ მივიდეს შეტყობინებები
3. დააწკაპუნე არხის სახელზე → **Edit Channel** → **Integrations** → **Webhooks**
4. დააჭირე **New Webhook** ღილაკს
5. დაარქვი სახელი (მაგალითად: "GitHub Deploy Bot")
6. დააკოპირე **Webhook URL**

### 2. GitHub Secret-ის დამატება

1. გადადი შენს GitHub რეპოზიტორიაზე: https://github.com/matvenko/Weather
2. გადადი **Settings** → **Secrets and variables** → **Actions**
3. დააჭირე **New repository secret**
4. სახელი: `DISCORD_WEBHOOK_URL`
5. ჩასვი დაკოპირებული Webhook URL
6. დააჭირე **Add secret**

### 3. გატესტე

როცა შემდეგ შევისს კოდს `main` ბრანჩში, Discord-ში ავტომატურად მოვა შეტყობინება:

- ✅ **წარმატებული დეპლოიმენტის** შემთხვევაში - მწვანე შეტყობინება
- ❌ **ჩავარდნის** შემთხვევაში - წითელი შეტყობინება

### შეტყობინებაში ინფორმაცია

ყოველი ნოთიფიკაცია შეიცავს:
- Repository-ის სახელს
- Branch-ის სახელს
- Commit-ის შეტყობინებას
- ავტორის სახელს
- ლინკს workflow-ის logs-ზე

---

## English Instructions

### 1. Create Discord Webhook

1. Open your Discord server where you want notifications
2. Go to the channel where notifications should appear
3. Click on channel name → **Edit Channel** → **Integrations** → **Webhooks**
4. Click **New Webhook**
5. Give it a name (e.g., "GitHub Deploy Bot")
6. Copy the **Webhook URL**

### 2. Add GitHub Secret

1. Go to your GitHub repository: https://github.com/matvenko/Weather
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `DISCORD_WEBHOOK_URL`
5. Paste the copied Webhook URL
6. Click **Add secret**

### 3. Test It

Next time you push to `main` branch, Discord will automatically receive a notification:

- ✅ **Successful deployment** - green message
- ❌ **Failed deployment** - red message

### Notification Contents

Each notification includes:
- Repository name
- Branch name
- Commit message
- Author name
- Link to workflow logs
