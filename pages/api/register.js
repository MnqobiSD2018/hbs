import dbConnect from "../../lib/mongodb";
import User from "../../models/user";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const { name, email, password, role } = req.body;

    try {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
  
        // Create new user
        const newUser = new User({
          name,
          email,
          password: hashedPassword, // Store hashed password
          role: role || "patient"
        });
  
        await newUser.save();
  
        res.status(201).json({ message: "User registered successfully!" });
      } catch (error) {
        res.status(500).json({ error: "Error registering user" });
      }
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  }
    /*
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword, role });
      await newUser.save();

      res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
      res.status(500).json({ error: "Error registering user" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
*/