import AuthButton from "./AuthButton";

function Navbar() {
  return (
    <nav className="w-full px-8 py-4 bg-white shadow flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-800">
        MMIL Recruitment
      </h1>

      <AuthButton />
    </nav>
  );
}

export default Navbar;
