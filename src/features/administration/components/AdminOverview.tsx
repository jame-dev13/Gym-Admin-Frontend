const AdminOverview = () => {
  return (
    <section className="flex w-full flex-1 flex-col gap-4" aria-labelledby="administration-heading">
      <div className="flex flex-col gap-2">
        <h1
          id="administration-heading"
          className="text-3xl font-bold tracking-tight text-text-primary"
        >
          Administration
        </h1>
        <p className="text-sm leading-relaxed text-text-secondary">
          Manage gym resources from here. Resource sections will be added to
          this home page as they become available.
        </p>
      </div>
    </section>
  );
};

export default AdminOverview;
