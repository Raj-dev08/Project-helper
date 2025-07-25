import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, KeyboardIcon, User } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useTypeWriter } from "../components/typeWriter";


import { motion } from "framer-motion";

const imageVariants = {
  initial: { opacity: 0, x: -300 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -300 },
};

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const { signup, isSigningUp } = useAuthStore();

  const text=useTypeWriter("Create Account",100)

  const validateForm = () => {
    if (!formData.name.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 4) return toast.error("Password must be at least 4 characters");
    
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();

    if (success === true) signup(formData);
  };

 return (
  <div className="min-h-screen flex items-center justify-center w-full login">
    <div className="w-full max-w-lg sm:max-w-5xl py-4 px-4 sm:py-6 md:py-8 space-y-8 bg-gradient-to-b  from-transparent to-base-300 backdrop-blur-sm rounded-sm flex flex-col lg:flex-row">
      {/* LOGO */}
      {/* <div className="text-center mb-8">
        <div className="flex flex-col items-center gap-2 group">
          <div
            className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
          group-hover:bg-primary/20 transition-colors"
          >
            <KeyboardIcon className="size-6 text-primary" />
          </div>
          
        </div>
      </div> */}

      <form onSubmit={handleSubmit} className="w-full lg:w-1/2 border-hidden p-6 rounded-lg shadow-lg mx-4 sm:mx-14">
         <div className="flex flex-col items-center gap-2 group ">
          <div
            className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
          group-hover:bg-primary/20 transition-colors"
          >
            <KeyboardIcon className="size-6 text-primary" />
          </div>
          
           <motion.h1 
            className="text-2xl font-bold mt-2 text-white text-center"
              initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            >
            {text}
        </motion.h1>

        </div>
       
        {/* Full Name */}
        <div className="form-control my-6">
          <label className="label">
            <span className="label-text font-medium">Full Name</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="size-5 text-base-content/40" />
            </div>
            <input
              type="text"
              className={`input input-bordered w-full pl-10`}
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
        </div>

        {/* Email */}
        <div className="form-control my-6">
          <label className="label">
            <span className="label-text font-medium">Email</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="size-5 text-base-content/40" />
            </div>
            <input
              type="email"
              className={`input input-bordered w-full pl-10`}
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        {/* Password */}
        <div className="form-control my-6">
          <label className="label">
            <span className="label-text font-medium">Password</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="size-5 text-base-content/40" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              className={`input input-bordered w-full pl-10`}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="size-5 text-base-content/40" />
              ) : (
                <Eye className="size-5 text-base-content/40" />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn my-6 bg-gradient-to-l from-primary to-secondary hover:bg-gradient-to-l hover:from-primary/40 hover:to-secondary/40 w-full  border-hidden" disabled={isSigningUp}>
          {isSigningUp ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Loading...
            </>
          ) : (
            "Create Account"
          )}
        </button>

        <div className="text-center">
          <p className="text-base-content/60">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary">
              Sign in
            </Link>
          </p>
        </div>

      </form>

      
       <motion.div
        className="hidden lg:flex w-full lg:w-1/2  items-center justify-center"
        variants={imageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.25 }}
      >
          <div className="max-w-md p-8 w-full">
            {/* Illustration */}
            <div className="relative aspect-square max-w-sm mx-auto roun">
              <img src="/i.png" alt="Language connection illustration" className="w-full h-full" />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">Connect with devs worldwide</h2>
              <p className="opacity-70">
                Help others and also upskill urself
              </p>
            </div>
          </div>
        </motion.div>
    </div>
  </div>
);
};
export default SignUpPage;