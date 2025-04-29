// hashPassword.js
const bcrypt = require('bcrypt');
const saltRounds = 10; // 솔트 라운드 수 (보안 강도, 10-12 권장)
const plainPassword = '1234'; // 해싱할 비밀번호

bcrypt.hash(plainPassword, saltRounds, function(err, hash) {
  if (err) {
    console.error('Error hashing password:', err);
  } else {
    console.log('--- Bcrypt Hash ---');
    console.log(hash); // 이 해시값을 복사하세요!
    console.log('-------------------');
    console.log('위 해시값을 복사하여 Firestore의 value 필드에 붙여넣으세요.');
  }
}); 