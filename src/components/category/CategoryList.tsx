import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCat, faBars } from '@fortawesome/free-solid-svg-icons';
import { ICategory } from '../../models';
import './CategoryList.css';

export default function CategoryList(props: {
  categories: ICategory[];
  filterTasksByCategory: any;
  selectedCategory: string;
}) {
  const [toggle, setToggle] = useState(false);
  return (
    <>
      <div className={`sidebar ${toggle ? 'sidebar-toggle' : ''}`}>
        <FontAwesomeIcon
          icon={faBars}
          className={'sidebar-fa-bars'}
          onClick={() => {
            setToggle(!toggle);
          }}
        ></FontAwesomeIcon>
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
