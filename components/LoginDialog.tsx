"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import FuzzyText from "./FuzzyText";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function LoginDialog() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      loginInfo.email === "admin@example.com" &&
      loginInfo.password === "1234"
    ) {
      localStorage.setItem("user", loginInfo.email);
      setIsLoginOpen(false);
      router.push("/dashboard");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="relative w-5/6 lg:w-1/2 h-[180px] mx-auto bg-cover bg-center bg-[url(https://i.pinimg.com/736x/66/70/33/6670333a45ede4a101901cb5fdd49ce2.jpg)]">
      {/* dark overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-brightness-50"></div>

      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogTrigger asChild>
          <div
            className="absolute top-42 bottom-4 right-[70px] cursor-pointer z-10 w-[270px] h-[60px] bg-no-repeat grayscale hover:scale-110 transition text-center py-2 bg-[url(/button.svg)] font-bold font-mono"
            onClick={() => {
              const user = localStorage.getItem("user");
              if (user) router.push("/dashboard");
              else setIsLoginOpen(true);
            }}
          >
            <FuzzyText baseIntensity={0.1} enableHover={false} fontSize={50}>
              Enter
            </FuzzyText>
          </div>
        </DialogTrigger>

        <DialogContent className=" border border-secondary">
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
            <DialogDescription className="">
              Enter your credentials to continue.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleLogin} className="mt-4 space-y-3">
            <Input type="text"
              placeholder="Email"
              value={loginInfo.email}
              onChange={(e) =>
                setLoginInfo({ ...loginInfo, email: e.target.value })
              }/>
              <br />
            <Input
              type="password"
              placeholder="Password"
              value={loginInfo.password}
              onChange={(e) =>
                setLoginInfo({ ...loginInfo, password: e.target.value })
              }
                          />
            {error && <p className="text-destructive">{error}</p>}
              <div className="flex justify-end">
            <Button size={'lg'}>Log In</Button>

              </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
