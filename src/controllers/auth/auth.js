import { error } from "console";
import { Customer, DeliveryPartner } from "../../model/user.js";
import jwt from "jsonwebtoken";

const generateToken = (users) => {
  const accessToken = jwt.sign(
    {
      userId: users._id,
      role: users.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
  const refreshToken = jwt.sign(
    {
      userId: users._id,
      role: users.role,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};

export const loginCustomer = async (req, reply) => {
  //Burada login işlemi yapılacak, eğer kullanıcı yoksa kayıt olacak ve token dönecek
  try {
    const { phone } = req.body;
    //Kullanıcı var mı kontrol et yoksa oluştur ve token döndür
    let customer = await Customer.findOne({ phone });
    if (!customer) {
      customer = new Customer({
        phone,
        role: "Customer",
        isActivated: true,
      });
      await customer.save();
    }
    const { accessToken, refreshToken } = generateToken(customer);
    return reply.send({
      message: customer ? "Login successful" : "Register successful",
      accessToken,
      refreshToken,
      customer,
    });
  } catch (error) {
    return reply.status(500).send({ message: error.message });
  }
};

export const loginDeliveryPartner = async (req, reply) => {
  try {
    const { email, password } = req.body;

    let deliveryPartner = await DeliveryPartner.findOne({ email });
    if (!deliveryPartner) {
      return reply.status(404).send({ message: "Delivery Partner not found" });
    }
    const isMatch = password === deliveryPartner.password;
    if (!isMatch) {
      return reply.status(400).send({ message: "Password is incorrect" });
    }
    const { accessToken, refreshToken } = generateToken(deliveryPartner);
    return reply.send({
      message: "Login successful",
      accessToken,
      refreshToken,
      deliveryPartner,
    });
  } catch (error) {
    return reply.status(500).send({ message: error.message });
  }
};

export const refreshToken = async (req, reply) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return reply.status(403).send({ message: "Refresh token is required" });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    let user;

    if (decoded.role === "Customer") {
      user = await Customer.findById(decoded.userId);
    } else if (decoded.role === "Delivery Partner") {
      user = await DeliveryPartner.findById(decoded.userId);
    } else {
      return reply.status(403).send({ message: "Invalid Role" });
    }

    if (!user) {
      return reply
        .status(404)
        .send({ message: "User not found | Invalid refresh token" });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateToken(user);
    return reply.send({
      message: "Token Refreshed",
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return reply.status(500).send({ message: error.message });
  }
};

export const fetchUser = async (req, reply) => {
    //Burada kullanıcı bilgileri getirilecek ve dönecek 
  try {
    const { userId, role } = req.user;
    let user;

    if (role === "Customer") {
      user = await Customer.findById(userId);
    } else if (role === "Delivery Partner") {
      user = await DeliveryPartner.findById(userId);
    } else {
      return reply.status(403).send({ message: "Invalid Role" });
    }

    if (!user) {
      return reply.status(404).send({ message: "User not found" });
    }

    return reply.send({ message: "User fetched successfully", user });
  } catch (error) {
    return reply.status(500).send({ message: error.message });
  }
};
