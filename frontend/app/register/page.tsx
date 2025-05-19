"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";

import AuthCard from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/axios";

interface RegisterFormValues {
  username: string;
  email: string;
  phone_number: string;
  password: string;
}

const Register = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      username: "",
      email: "",
      phone_number: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await authService.signup({
        username: data.username.trim(),
        email: data.email.trim(),
        phone_number: data.phone_number.trim(),
        password: data.password.trim(),
      });
      await authService.login({
        username: data.username.trim(),
        password: data.password.trim(),
      });

      toast.success("Account created successfully!", {
        description: "Welcome to Community Pulse!",
      });

      router.push("/");
    } catch (error: any) {
      toast.error("Registration failed", { description: error.message });
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <main className="flex items-center justify-center min-h-screen">
      <AuthCard>
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">Create an Account</h1>
            <p className="text-muted-foreground">
              Enter your information to register
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">User Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  className="pl-10"
                  {...register("username", {
                    required: "Username is required",
                    pattern: {
                      value: /^[a-z0-9._]{3,20}$/,
                      message:
                        "Username can only contain lowercase letters, numbers, dots, and underscores (3-20 characters)",
                    },
                    validate: {
                      noConsecutiveDots: (value) =>
                        !value.includes("..") ||
                        "Username cannot contain consecutive dots",
                      noConsecutiveUnderscores: (value) =>
                        !value.includes("__") ||
                        "Username cannot contain consecutive underscores",
                      startsWithAlphanumeric: (value) =>
                        /^[a-z0-9]/.test(value) ||
                        "Username must start with a letter or number",
                      endsWithAlphanumeric: (value) =>
                        /[a-z0-9]$/.test(value) ||
                        "Username must end with a letter or number",
                    },
                  })}
                />
              </div>
              {errors.username && (
                <p className="text-sm text-destructive">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  className="pl-10"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  className="pl-10"
                  {...register("phone_number", {
                    required: "Phone number is required",
                    pattern: {
                      value:
                        /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/,
                      message: "Invalid phone number",
                    },
                  })}
                />
              </div>
              {errors.phone_number && (
                <p className="text-sm text-destructive">
                  {errors.phone_number.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="pl-10 pr-10"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute right-3 top-3 text-muted-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="text-sm text-center">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-400 font-medium hover:underline"
              >
                Login
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-500/70 transition-all cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </Button>
          </form>
        </div>
      </AuthCard>
    </main>
  );
};

export default Register;
