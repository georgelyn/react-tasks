import { ICategory } from '../models';
import './Sidebar.css';

export default function Sidebar(props: {
  categories: ICategory[];
  filterTasksByCategory: any;
  selectedCategory: string;
}) {
  return (
    <>
      <div className="sidebar">
        <ul>
          {props.categories.map((category, index) => {
            if (category.id) {
              return (
                <li
                  className={
                    category.id === props.selectedCategory
                      ? 'category-selected'
                      : ''
                  }
                  key={category.id}
                  onClick={() => {
                    props.filterTasksByCategory({
                      field: 'categoryId',
                      value: `${category.id}`,
                    });
                  }}
                >
                  {category.name}
                </li>
              );
            }
          })}
        </ul>
      </div>
    </>
  );
}
