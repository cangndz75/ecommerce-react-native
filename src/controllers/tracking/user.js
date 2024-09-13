import { Customer, DeliveryPartner } from "../../model/index.js";

export const updateUser = async (req, reply) => {
  try {
    const { userId } = req.user;
    const updateData = req.body;

    let user =
      (await Customer.findById(userId)) ||
      (await DeliveryPartner.findById(userId));
    if (!user) {
      return reply.status(404).send({ message: "User not found" });
    }

    let UserModel;
    if (user.role === "Customer") {
      UserModel = Customer;
    } else if (user.role === "Delivery Partner") {
      UserModel = DeliveryPartner;
    } else {
      return reply.status(403).send({ message: "Invalid role" });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return reply.status(404).send({ message: "User not found" });
    }

    return reply.send({
      message: "User updated",
      user: updatedUser,
    });
  } catch (error) {
    return reply.status(500).send({ message: error.message });
  }
};
