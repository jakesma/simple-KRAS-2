/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { MANUFACTURING_CATEGORIES, SubCategory } from '../data/categories';

interface CategorySelectorProps {
  onSelectCategory: (category: SubCategory) => void;
  onBack: () => void;
}

export default function CategorySelector({ onSelectCategory, onBack }: CategorySelectorProps) {
  const [selectedMainCategory, setSelectedMainCategory] = useState<string | null>(null);

  const currentCategory = MANUFACTURING_CATEGORIES.find((c) => c.id === selectedMainCategory);

  if (!MANUFACTURING_CATEGORIES || MANUFACTURING_CATEGORIES.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">카테고리 데이터 로딩 중...</h1>
          <p className="text-gray-600">카테고리 데이터를 불러올 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => {
              console.log('Back button clicked');
              onBack();
            }}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-medium mb-5"
          >
            <ArrowLeft size={20} />
            돌아가기
          </button>
          <p className="text-sm text-blue-600 font-semibold mb-2">공종별 위험성평가</p>
          <h1 className="text-2xl font-bold text-slate-900">공정 또는 서비스 키워드를 선택하세요</h1>
        </div>

        {!selectedMainCategory ? (
          // Main Category Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {MANUFACTURING_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  console.log('Selecting main category:', category.id);
                  setSelectedMainCategory(category.id);
                }}
                className="rounded-lg border border-slate-200 bg-white px-5 py-4 text-left transition hover:border-blue-400 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <h3 className="text-base font-bold text-slate-900">{category.name}</h3>
              </button>
            ))}
          </div>
        ) : (
          // Sub Category List
          <div>
            <div className="mb-6">
              <button
                onClick={() => {
                  console.log('Going back to main categories');
                  setSelectedMainCategory(null);
                }}
                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
              >
                <ArrowLeft size={20} />
                {currentCategory?.name} 뒤로가기
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {currentCategory?.subCategories.map((subCategory) => (
                <button
                  key={subCategory.id}
                  onClick={() => onSelectCategory(subCategory)}
                  className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-center text-sm font-bold text-slate-800 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {subCategory.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
