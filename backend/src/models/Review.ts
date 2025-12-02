import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  isApproved: boolean;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Please provide a comment'],
      trim: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Update product rating when review is approved
ReviewSchema.post('save', async function () {
  if (this.isApproved && this.isVisible) {
    const Review = mongoose.model('Review');
    const Product = mongoose.model('Product');
    
    const reviews = await Review.find({
      product: this.product,
      isApproved: true,
      isVisible: true,
    });
    
    const avgRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    
    await Product.findByIdAndUpdate(this.product, {
      rating: Math.round(avgRating * 10) / 10,
      numReviews: reviews.length,
    });
  }
});

export default mongoose.model<IReview>('Review', ReviewSchema);


