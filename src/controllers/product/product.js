import { Product } from "../../model/products.js";

export const getProductsByCategoryId = async (req, reply) => {
  const { categoryId } = req.params;
  try {
    const products = await Product.find({ categoryId: categoryId })
      .select("-category")
      .exec();
    return reply.send(products);
  } catch (error) {
    return reply.status(500).send({ message: error.message });
  }
};
