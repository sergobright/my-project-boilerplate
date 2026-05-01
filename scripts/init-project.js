const fs = require('fs');
const path = require('path');
const readline = require('readline');
const crypto = require('crypto');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ROOT_DIR = path.join(__dirname, '..');

// 1. Files where "HexaCash" should be replaced
const filesToRename = [
  'package.json',
  'apps/web/package.json',
  'docker-compose.yml',
  '.devcontainer/devcontainer.json',
  '.devcontainer/docker-compose.dev.yml'
];

// 2. Memory bank files to clear
const memoryBankFilesToClear = [
  'memory-bank/activeContext.md',
  'memory-bank/progress.md'
];

async function init() {
  console.log('🚀 Инициализация нового проекта из Universal AI SaaS Boilerplate\n');

  rl.question('Введите название нового проекта (например, SuperCRM): ', (projectName) => {
    if (!projectName || projectName.trim() === '') {
      console.error('❌ Ошибка: Имя проекта не может быть пустым.');
      process.exit(1);
    }

    const safeName = projectName.trim();
    const safeNameLower = safeName.toLowerCase();

    console.log(`\n⚙️ Заменяем "HexaCash" на "${safeName}"...`);
    for (const relativePath of filesToRename) {
      const fullPath = path.join(ROOT_DIR, relativePath);
      if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        // Replace exact case
        content = content.replace(/HexaCash/g, safeName);
        // Replace lower case (like in package.json)
        content = content.replace(/hexacash/g, safeNameLower);
        fs.writeFileSync(fullPath, content);
        console.log(`  ✅ Обновлён: ${relativePath}`);
      } else {
        console.warn(`  ⚠️ Файл не найден: ${relativePath}`);
      }
    }

    console.log('\n🧹 Очистка истории Memory Bank...');
    for (const relativePath of memoryBankFilesToClear) {
      const fullPath = path.join(ROOT_DIR, relativePath);
      if (fs.existsSync(fullPath)) {
        const baseName = path.basename(relativePath);
        const emptyTemplate = `# ${baseName.replace('.md', '')}\n\nЗдесь будет вестись история текущего состояния проекта ${safeName}.`;
        fs.writeFileSync(fullPath, emptyTemplate);
        console.log(`  ✅ Очищен: ${relativePath}`);
      }
    }

    console.log('\n🔐 Генерация новых секретов (.env)...');
    const envExamplePath = path.join(ROOT_DIR, '.env.example');
    const envPath = path.join(ROOT_DIR, '.env');
    
    if (fs.existsSync(envExamplePath)) {
      let envContent = fs.readFileSync(envExamplePath, 'utf8');
      
      // Generate NextAuth secret
      const nextAuthSecret = crypto.randomBytes(32).toString('base64');
      envContent = envContent.replace(/NEXTAUTH_SECRET=""/, `NEXTAUTH_SECRET="${nextAuthSecret}"`);
      
      // Update DB URL if needed
      envContent = envContent.replace(/hexacash/g, safeNameLower);
      
      fs.writeFileSync(envPath, envContent);
      console.log('  ✅ Создан .env с новыми секретами.');
    } else {
      console.warn('  ⚠️ .env.example не найден. Пропуск.');
    }

    console.log('\n🎉 Инициализация завершена!');
    console.log('Следующие шаги:');
    console.log('1. pnpm install');
    console.log('2. docker compose up -d');
    console.log('3. pnpm --filter web db:migrate');
    console.log('4. pnpm dev');

    rl.close();
  });
}

init();
