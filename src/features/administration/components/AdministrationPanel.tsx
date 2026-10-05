type AdministrationPanelProps = {
  title: string;
  description: string;
};

const AdministrationPanel = ({ title, description }: AdministrationPanelProps) => {
  return (
    <section className="flex w-full flex-1 flex-col gap-4" aria-labelledby="administration-panel-heading">
      <div className="flex flex-col gap-2">
        <h1
          id="administration-panel-heading"
          className="text-3xl font-bold tracking-tight text-text-primary"
        >
          {title}
        </h1>
        <p className="text-sm leading-relaxed text-text-secondary">
          {description}
        </p>
      </div>
    </section>
  );
};

export default AdministrationPanel;
