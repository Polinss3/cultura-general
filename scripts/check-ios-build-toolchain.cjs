const { execFileSync } = require('node:child_process');

if (process.env.EAS_BUILD_PLATFORM === 'ios') {
  const version = execFileSync('xcodebuild', ['-version'], { encoding: 'utf8' });
  const major = Number(version.match(/^Xcode (\d+)/m)?.[1]);
  if (!Number.isFinite(major)) {
    throw new Error(`No se pudo identificar la versión de Xcode: ${version.trim()}`);
  }
  if (major >= 27) {
    throw new Error(
      'Esta rama usa Expo SDK 54 sin el ciclo de vida UIScene. ' +
      'Las builds compiladas con Xcode 27 se cierran al abrirse en iOS 27. ' +
      'Para una build local, instala Xcode 26.4 en paralelo y selecciona ' +
      'su ruta con DEVELOPER_DIR antes de ejecutar eas build --local. ' +
      'También puedes compilar en EAS Cloud con el perfil testflight (sin --local).'
    );
  }
}
