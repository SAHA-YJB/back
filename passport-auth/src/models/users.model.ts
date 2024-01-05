import mongoose from 'mongoose';

// 유저 스키마 정의
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  googleId: {
    type: String,
    unique: true,
  },
});

const User = mongoose.model('User', userSchema);

export default User;
