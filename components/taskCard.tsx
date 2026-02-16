import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react"; // Radix-compatible icons
import Link from "next/link";

type Task = {
  id: string;
  title: string;
  description: string;
  content?: string;
};

import TaskDialog from "./taskDialog";

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => Promise<void>;
  onDelete?: (taskId: string) => void;
}

const TaskCard = ({ task, onDelete, onEdit }: TaskCardProps) => {
  return (
    <Card className="flex justify-between items-center p-4">
      <CardContent className="flex-1">
        <Link href={`/task/${task.id}`} className="hover:underline">
          <h3 className="font-medium">{task.title}</h3>
          <p className="text-muted-foreground">{task.description}</p>
        </Link>
      </CardContent>
      <div className="flex gap-2">
        <TaskDialog
          task={task}
          onEdit={onEdit}
          trigger={
            <Button variant="outline" size="sm">
              <Pencil className="w-4 h-4" />
            </Button>
          }
        />
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete?.(task.id)}
        >
          <Trash className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

export default TaskCard;
