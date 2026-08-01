import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Offer title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Offer description is required'],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required for an offer'],
    },
    bannerImage: {
      public_id: {
        type: String,
        required: [true, 'Banner image public ID is required'],
      },
      url: {
        type: String,
        required: [true, 'Banner image URL is required'],
      },
      width: {
        type: Number,
      },
      height: {
        type: Number,
      },
      format: {
        type: String,
      },
      bytes: {
        type: Number,
      },
    },
    status: {
      type: String,
      enum: {
        values: ['upcoming', 'active', 'expired'],
        message: '{VALUE} is not a valid offer status',
      },
      default: 'active',
    },
    discountPercentage: {
      type: Number,
      required: [true, 'Discount percentage is required'],
      min: [1, 'Discount percentage must be between 1% and 100%'],
      max: [100, 'Discount percentage must be between 1% and 100%'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      validate: {
        validator: function (value) {
          return this.startDate <= value;
        },
        message: 'End date must be on or after start date',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Automatically set status based on startDate and endDate relative to current time
offerSchema.pre('save', function () {
  const now = new Date();
  const start = new Date(this.startDate);
  const end = new Date(this.endDate);

  if (now < start) {
    this.status = 'upcoming';
  } else if (now > end) {
    this.status = 'expired';
  } else {
    this.status = 'active';
  }
});

const Offer = mongoose.model('Offer', offerSchema);
export default Offer;
