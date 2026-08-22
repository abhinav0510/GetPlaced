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
import { useEffect } from "react";
import { Plus } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, { message: "Company name is required" }),
  logo: z
    .any()
    .refine(
      (file) =>
        file[0] &&
        (file[0].type === "image/png" || file[0].type === "image/jpeg" || file[0].type === "image/webp" || file[0].type === "image/svg+xml"),
      {
        message: "Only Images are allowed",
      }
    ),
});

const AddCompanyDrawer = ({ fetchCompanies }) => {
  const {
    register,
    handleSubmit,
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
      ...data,
      logo: data.logo[0],
    });
  };

  useEffect(() => {
    if (dataAddCompany?.length > 0) {
      fetchCompanies();
    }
  }, [loadingAddCompany]);

  return (
    <Drawer>
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
        <form className="flex flex-col sm:flex-row gap-3 p-4 pb-0">
          {/* Company Name */}
          <Input placeholder="Company name" className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400" {...register("name")} />

          {/* Company Logo */}
          <Input
            type="file"
            accept="image/*"
            className="bg-white border-slate-200 text-slate-900 file:text-slate-700"
            {...register("logo")}
          />

          {/* Add Button */}
          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            variant="blue"
            className="w-full sm:w-36 font-semibold"
          >
            Add
          </Button>
        </form>
        <DrawerFooter>
          {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          {errors.logo && <p className="text-red-500 text-xs">{errors.logo.message}</p>}
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
