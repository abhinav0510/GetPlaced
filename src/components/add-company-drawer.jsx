/* eslint-disable react/prop-types */
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useFetch from "@/hooks/use-fetch";
import { addNewCompany } from "@/api/apiCompanies";
import { BarLoader } from "react-spinners";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, { message: "Company name is required" }),
  logo: z
    .any()
    .optional()
    .refine(
      (file) =>
        !file ||
        !file[0] ||
        ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml"].includes(file[0]?.type),
      {
        message: "Only image files (PNG, JPEG, WEBP, SVG) are allowed",
      }
    ),
});

const AddCompanyDrawer = ({ fetchCompanies }) => {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingAddCompany,
    error: errorAddCompany,
    data: dataAddCompany,
    fn: fnAddCompany,
  } = useFetch(addNewCompany);

  const onSubmit = async (data) => {
    fnAddCompany({
      name: data.name,
      logo: data.logo && data.logo[0] ? data.logo[0] : null,
    });
  };

  useEffect(() => {
    if (dataAddCompany) {
      fetchCompanies();
      reset();
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataAddCompany]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button
          type="button"
          className="bg-blue-50/80 hover:bg-blue-100 text-blue-600 font-semibold px-4 py-3 rounded-xl border border-blue-100 flex items-center gap-1.5 text-sm transition-all whitespace-nowrap cursor-pointer shadow-2xs"
        >
          <Plus size={18} />
          Add Company
        </button>
      </DrawerTrigger>
      <DrawerContent className="bg-white text-slate-900 border-slate-200">
        <DrawerHeader>
          <DrawerTitle className="text-slate-900 font-bold text-lg">Add a New Company</DrawerTitle>
        </DrawerHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3 p-4 pb-0">
          {/* Company Name */}
          <div className="flex-1">
            <Input placeholder="Company name" className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400" {...register("name")} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* Company Logo */}
          <div className="flex-1">
            <Input
              type="file"
              accept="image/*"
              className="bg-white border-slate-200 text-slate-900 file:text-slate-700"
              {...register("logo")}
            />
            {errors.logo && <p className="text-red-500 text-xs mt-1">{errors.logo.message}</p>}
          </div>

          {/* Add Button */}
          <Button
            type="submit"
            disabled={loadingAddCompany}
            variant="blue"
            className="w-full sm:w-36 font-semibold"
          >
            {loadingAddCompany ? "Adding..." : "Add"}
          </Button>
        </form>
        <DrawerFooter>
          {errorAddCompany?.message && (
            <p className="text-red-500 text-xs">{errorAddCompany?.message}</p>
          )}
          {loadingAddCompany && <BarLoader width={"100%"} color="#2563eb" />}
          <DrawerClose asChild>
            <Button type="button" variant="outline" className="border-slate-200 text-slate-700">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddCompanyDrawer;
