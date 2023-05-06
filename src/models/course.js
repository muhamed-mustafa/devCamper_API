import { Schema, model } from 'mongoose';

const courseSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, 'Please add a course title'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    weeks: {
      type: String,
      required: [true, 'Please add number of weeks'],
    },
    tuition: {
      type: Number,
      required: [true, 'Please add a tuition cost'],
    },
    minimumSkill: {
      type: String,
      required: [true, 'Please add a minimum skill'],
      enum: ['beginner', 'intermediate', 'advanced'],
    },
    scholarshipAvailable: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    bootcamp: {
      type: Schema.Types.ObjectId,
      ref: 'BootCamp',
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

// Static method to get avg of course tuitions
courseSchema.statics.getAverageCost = async function (bootcampId) {
  console.log('Calculating avg cost...'.blue);

  const obj = await this.aggregate([
    { $match: { bootcamp: bootcampId } },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' },
      },
    },
  ]);

  try {
    await this.model('BootCamp').findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageCost after save
courseSchema.post('save', { document: true }, function () {
  this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost before remove
courseSchema.post('deleteOne', { document: true }, function () {
  this.constructor.getAverageCost(this.bootcamp);
});

export const Course = model('Course', courseSchema);
