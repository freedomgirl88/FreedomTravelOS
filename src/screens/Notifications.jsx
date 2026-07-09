import Page from "../components/Page";
import Card from "../components/Card";
import SectionTitle from "../components/SectionTitle";
import { getDaysUntil } from "../utils/helpers";

export default function Notifications({ store }) {
  const { trip, packingProgress, remainingSGD, activeDay, activeVisited } = store;
  const notes = [
    ["✈️", "Flight", `${trip.flight.flightNumber} departs in ${getDaysUntil(trip.flight.departureDate)} days.`],
    ["🧳", "Packing", `${packingProgress}% complete. Leave shopping space.`],
    ["💰", "Budget", `SGD ${remainingSGD.toFixed(2)} remaining.`],
    ["📍", "Explore", `Day ${activeDay.day}: ${activeVisited}/${activeDay.places.length} places visited.`]
  ];

  return (
    <Page>
      <header className="app-header">
        <div><span className="eyebrow">Smart Assistant</span><h1>Alerts</h1></div>
        <span className="status-chip">Beta</span>
      </header>
      <SectionTitle title="Trip Reminders" subtitle="Generated from your saved data." />
      <div className="notification-stack">
        {notes.map(([icon, title, text]) => (
          <Card className="notification-card" key={title}>
            <span>{icon}</span>
            <div><strong>{title}</strong><p>{text}</p></div>
          </Card>
        ))}
      </div>
    </Page>
  );
}
