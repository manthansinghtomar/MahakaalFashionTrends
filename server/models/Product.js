import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    sku: {
      type: String,
      required: [true, 'SKU identifier is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    brand: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
      type: Number,
      required: [true, 'Original price is required'],
      min: [0, 'Original price cannot be negative'],
    },
    discountPercentage: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be less than 0%'],
      max: [100, 'Discount cannot exceed 100%'],
    },
    images: {
      type: [
        {
          public_id: {
            type: String,
            required: [true, 'Image public ID is required'],
          },
          url: {
            type: String,
            required: [true, 'Image URL is required'],
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
      ],
      required: [true, 'At least one product image is required'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'A product must have at least one image',
      },
    },
    sizes: {
      type: [String],
      default: [],
    },
    colors: {
      type: [String],
      default: [],
    },
    material: {
      type: String,
      trim: true,
      default: '',
    },
    fit: {
      type: String,
      trim: true,
      default: '',
    },
    fabric: {
      type: String,
      trim: true,
      default: '',
    },
    careInstructions: {
      type: String,
      trim: true,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      required: [true, 'Product stock is required'],
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be greater than 5'],
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: [0, 'Review count cannot be negative'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    newArrival: {
      type: Boolean,
      default: false,
    },
    bestSeller: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'inactive', 'outofstock'],
        message: '{VALUE} is not a valid product status',
      },
      default: 'active',
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

// Pre-save hook to calculate discount percentage automatically if not explicitly provided
productSchema.pre('save', function () {
  if (this.originalPrice && this.price && this.originalPrice > this.price) {
    this.discountPercentage = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
});

const Product = mongoose.model('Product', productSchema);
export default Product;
