type HomePanelProps = {
  title: string;
  description: string;
};

const HomePanel = ({ title, description }: HomePanelProps) => {
  return (
    <section
      className="flex w-full flex-1 flex-col gap-4"
      aria-labelledby="home-panel-heading"
    >
      <div className="flex flex-col gap-2">
        <h1
          id="home-panel-heading"
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

export default HomePanel;
