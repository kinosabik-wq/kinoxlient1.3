# kinoxlient v1.2 — Dark Glass

Вертикальный модульный игровой лаунчер. Vite + Capacitor + Three.js.

## В этой версии
- Dark Glass лаунчер со звёздным фоном и семью SVG-иконками.
- Общий локальный виртуальный баланс (старт 10 ₽), автосохранение.
- Три кликера с улучшениями, бонусом серии, автокликерами и престижем.
- Minegoing на Three.js: настоящая 3D-сцена с воксельным персонажем, тремя полосами, прыжком, препятствиями, сменой измерений и Херобрином-преследователем.
- Zombie Gate: волны врагов, здоровье ворот, стрельба, награды и прокачка оружия/отряда.
- Верстак, инвентарь, достижения.

## Запуск
Требуется Node.js LTS.
```bash
npm install
npm run start
```
Сборка веб-версии:
```bash
npm run build
```

## Android APK
Требуются Android Studio, Android SDK и JDK 17.
```bash
npm install
npm run build
npx cap add android
npx cap sync android
npx cap open android
```
В Android Studio: Build → Build Bundle(s) / APK(s) → Build APK(s).
Ожидаемый путь: `android/app/build/outputs/apk/debug/app-debug.apk`.

## Примечания
Three.js входит в зависимости проекта и собирается локально Vite; удалённые игровые ассеты не требуются. Minegoing — базовая 3D-аркада, Zombie Gate — базовая волновая оборона; это ещё не финальная кампания. Баланс ₽ — виртуальные очки, без реального вывода. Перед распространением нужны сборка и тест на Android-устройстве.

## Получить APK без Android Studio (облачная сборка)

В репозитории уже есть GitHub Actions workflow `.github/workflows/android-apk.yml`. Он автоматически собирает debug APK при push в `main`/`master`, а также запускается вручную.

1. Создай пустой репозиторий на GitHub и загрузи туда содержимое этой папки.
2. Открой вкладку **Actions** и выбери **Build kinoxlient APK**.
3. Нажми **Run workflow** (если сборка не стартовала после загрузки).
4. После успешной сборки открой запуск workflow и скачай артефакт **kinoxlient-android-debug-apk**. Внутри будет `app-debug.apk`.
5. Передай APK на Xiaomi и открой его. Android может попросить разрешить установку приложений из этого источника.

Это debug APK для личной установки и тестирования, не подписанный релиз для Google Play. Для загрузки в Play Store понадобится отдельная release-сборка и подпись.
