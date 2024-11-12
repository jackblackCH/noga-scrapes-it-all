/* eslint-disable @next/next/no-img-element */
'use client';

import * as React from 'react';
import { Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z
  .object({
    companyName: z.string().min(1, 'Company name is required'),
    companyWebsite: z.string().url('Please enter a valid URL').optional(),
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export function PostJobFormComponent() {
  const [logo, setLogo] = React.useState<File | null>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: '',
      companyWebsite: '',
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  function onSubmit() {
    // Handle form submission
    // console.log(values);
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogo(file);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-gray-600 mb-4">
            Alt Protein employers: We will post a regular job post (not featured) for 30 days at no
            cost for all alternative protein-related roles. Please email noga@altproteinpartners.com
            to get your job posted for free.
          </p>
          <p className="text-gray-600">
            For more options or to feature a job (approx. 3x visibility), please input your company
            and job information:
          </p>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center">
              1
            </div>
            <div>
              <p className="font-medium">Step 1</p>
              <p className="text-sm text-gray-600">Company Details</p>
            </div>
          </div>
          {[2, 3, 4].map((step) => (
            <div key={step} className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                {step}
              </div>
              <div>
                <p className="font-medium">Step {step}</p>
                <p className="text-sm text-gray-600">
                  {step === 2 ? 'Job Details' : step === 3 ? 'Posting Type' : 'Payment'}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Card>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">COMPANY DETAILS</h2>

                  <div className="border rounded-lg p-6 text-center">
                    <input
                      type="file"
                      ref={fileRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoUpload}
                    />
                    {logo ? (
                      <div className="relative w-32 h-32 mx-auto">
                        <img
                          src={URL.createObjectURL(logo)}
                          alt="Company logo"
                          className="w-full h-full object-contain"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="absolute top-0 right-0"
                          onClick={() => setLogo(null)}
                        >
                          Change
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="w-32 h-32 mx-auto border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400"
                        onClick={() => fileRef.current?.click()}
                      >
                        <Upload className="h-8 w-8 text-gray-400" />
                        <span className="mt-2 text-sm text-gray-600">Upload logo</span>
                      </div>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name*</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="companyWebsite"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Website</FormLabel>
                        <FormControl>
                          <Input placeholder="www.your-company.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">YOUR ACCOUNT DETAILS</h2>

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name*</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email*</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password*</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password*</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <p className="text-sm text-gray-600">
                    This site is protected by reCAPTCHA and the Google{' '}
                    <a href="#" className="text-primary hover:text-primary/80 hover:underline">
                      Privacy Policy
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-primary hover:text-primary/80 hover:underline">
                      Terms of Service
                    </a>{' '}
                    apply.
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="bg-emerald-700 hover:bg-emerald-800">
                    Next
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already registered?{' '}
            <a href="#" className="text-emerald-700 hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
