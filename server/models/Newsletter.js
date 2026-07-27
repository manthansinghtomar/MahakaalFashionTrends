import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Please enter your email address.'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address.',
      ],
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for email search and fast sorting
newsletterSchema.index({ email: 1 });
newsletterSchema.index({ subscribedAt: -1 });

const Newsletter = mongoose.model('Newsletter', newsletterSchema);
export default Newsletter;
