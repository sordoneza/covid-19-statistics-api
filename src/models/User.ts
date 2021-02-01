import mongoose, { Schema, Document, Model } from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import bcrypt from 'bcrypt';

interface IUser extends Document {
  email: string;
  password: string;
  connected: boolean;
}

interface UserModel extends Model<IUser> {
  login(email: string, password: string): Promise<IUser>;
  logout(id: string): Promise<IUser>;
}

const userSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Please enter an email'],
      unique: true,
      lowercase: true,
      validate: [isEmail, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      minlength: [8, 'Minimum password length is 8 characters'],
    },
    connected: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

// fire a function before doc saved to db
userSchema.pre<IUser>('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);

  this.connected = true;
  next();
});

// static method to login user
userSchema.statics.login = async function (email, password) {
  const user: IUser = await this.findOne({ email }).lean();
  if (user) {
    // Validate password
    const auth = await bcrypt.compare(password, user.password);

    if (auth) {
      // Mark User as connected
      await this.updateOne({ _id: user._id }, { connected: true }).lean();

      return user;
    }
    throw Error('Emair or password does not match');
  }
  throw Error('User account not Found');
};

// static method to logout user
userSchema.statics.logout = async function (userId) {
  return await this.updateOne({ _id: userId }, { connected: false });
};

const User: UserModel = mongoose.model<IUser, UserModel>('user', userSchema);

export default User;
