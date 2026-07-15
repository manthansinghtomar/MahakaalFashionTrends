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
        values: ['active', 'inactive'],
        message: '{VALUE} is not a valid offer status',
      },
      default: 'active',
    },
    discountPercentage: {
      type: Number,
      required: [true, 'Discount percentage is required'],
      min: [0, 'Discount cannot be less than 0%'],
      max: [100, 'Discount cannot exceed 100%'],
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

const Offer = mongoose.model('Offer', offerSchema);
export default Offer;
