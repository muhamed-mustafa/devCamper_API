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

// Static method to get avg of course tuitions
courseSchema.statics.getAverageCost = async function (bootcampId) {
  const obj = await this.aggregate([
    { $match: { bootcamp: bootcampId } },

    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' },
      },
    },
  ]);

  const averageCost = obj[0]
    ? Math.ceil(obj[0].averageCost / 10) * 10
    : undefined;

  try {
    await this.model('BootCamp').findByIdAndUpdate(bootcampId, {
      averageCost,
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageCost after save
courseSchema.post('save', { document: true }, async function () {
  await this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost before remove
courseSchema.post('deleteOne', { document: true }, async function () {
  await this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost after tuition update
courseSchema.post('findOneAndUpdate', async function (doc) {
  if (this.tuition !== doc.tuition) {
    await doc.constructor.getAverageCost(doc.bootcamp);
  }
});

export const Course = model('Course', courseSchema);
