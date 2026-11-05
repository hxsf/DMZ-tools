import book from "@tabler/icons/outline/book.svg?raw";
import flask from "@tabler/icons/outline/flask.svg?raw";
import calculator from "@tabler/icons/outline/calculator.svg?raw";
import checklist from "@tabler/icons/outline/checklist.svg?raw";
import search from "@tabler/icons/outline/search.svg?raw";
import down from "@tabler/icons/outline/chevron-down.svg?raw";
import right from "@tabler/icons/outline/chevron-right.svg?raw";
import plus from "@tabler/icons/outline/plus.svg?raw";
import minus from "@tabler/icons/outline/minus.svg?raw";
import trash from "@tabler/icons/outline/trash.svg?raw";
import language from "@tabler/icons/outline/language.svg?raw";
import close from "@tabler/icons/outline/x.svg?raw";

const icons = {
  book,
  flask,
  calculator,
  checklist,
  search,
  "chevron-down": down,
  "chevron-right": right,
  plus,
  minus,
  trash,
  language,
  x: close,
};

/** 静态导入的 Tabler 图标，内容不包含用户输入。 */
export function Icon({ name }: { name: keyof typeof icons }) {
  return <span class="icon" aria-hidden="true" dangerouslySetInnerHTML={{ __html: icons[name] }} />;
}
