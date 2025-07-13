function About() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-indigo-600">About This App</h1>
      <p className="mt-4 text-gray-700 max-w-lg text-center">
        This app encourages people to go outside by recommending nearby outdoor locations filtered by their mood.
      </p>
    </div>
  );
}

export default About;