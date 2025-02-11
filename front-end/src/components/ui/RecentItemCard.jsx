
  // components/cards/RecentItemCard.jsx
  export function RecentItemCard({ title, author, department, date }) {
    return (
      <div className="border-b pb-4 hover:bg-muted/5 transition-all duration-200">
        <h3 className="font-medium hover:text-primary cursor-pointer transition-colors">
          {title}
        </h3>
        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
          <span>Author: {author}</span>
          <span>•</span>
          <span>{department}</span>
          <span>•</span>
          <span>Added: {date}</span>
        </div>
      </div>
    );
  }