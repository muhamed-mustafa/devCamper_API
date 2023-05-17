import { Schema, model } from 'mongoose';
import { ErrorResponse } from '../utils/errorResponse.js';

const reviewSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, 'Please add a title for the review'],
      maxlength: 100,
    },

    text: {
      type: String,
      required: [true, 'Please add some text'],
    },

    rating: {
      type: Number,
      min: 1,
      max: 10,
      required: [true, 'Please add a rating between 1 and 10'],
    },

    bootcamp: {
      type: Schema.Types.ObjectId,
      ref: 'BootCamp',
      required: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        (ret.id = ret._id), delete ret._id;
      },
    },
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Create a partial unique index on the bootcamp and user fields
reviewSchema.index(
  { bootcamp: 1, user: 1 },
  {
    unique: true,
    partialFilterExpression: {
      bootcamp: { $exists: true },
      user: { $exists: true },
    },
  }
);

// Define a pre-save hook to check for duplicate reviews by the same user for a single bootcamp
reviewSchema.pre('save', async function (next) {
  const review = this;

  const existingReview = await review.constructor.findOne({
    bootcamp: review.bootcamp,
    user: review.user,
  });

  if (existingReview && review._id !== existingReview._id) {
    return next(new ErrorResponse('User already reviewed this bootcamp', 400));
  }

  next();
});

// Static method to get avg rating and save
reviewSchema.statics.getAverageRating = async function (bootcampId) {
  const obj = await this.aggregate([
    { $match: { bootcamp: bootcampId } },

    {
      $group: {
        _id: '$bootcamp',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  try {
    await this.model('BootCamp').findByIdAndUpdate(bootcampId, {
      averageRating: obj[0] ? obj[0].averageRating.toFixed(1) : undefined,
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageCost after save
reviewSchema.post('save', { document: true }, async function () {
  await this.constructor.getAverageRating(this.bootcamp);
});

// Call getAverageCost before remove
reviewSchema.post('deleteOne', { document: true }, async function () {
  await this.constructor.getAverageRating(this.bootcamp);
});

export const Review = model('Review', reviewSchema);
