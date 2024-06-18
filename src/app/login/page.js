import Auth3rdParty from "../../components/Auth3rdParty";
import CustomAuth from "../../components/AuthCustom";

const LoginPage = () => {
  return (
    <div className="h-[calc(100vh-80px)] px-4 mt-32 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex justify-center">
      <div className="flex flex-col gap-10">
        <CustomAuth />

        <div className="flex justify-center items-center gap-2">
          <div className="h-[1px] bg-[#0c0c0c] w-[44%]" />
          <div className="">Or</div>
          <div className="h-[1px] bg-[#0c0c0c] w-[44%]" />
        </div>

        <Auth3rdParty />
      </div>
    </div>
  );
};

export default LoginPage;
