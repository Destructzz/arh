const fs = require('fs');

const categoriesNames = [
    'Тенелюбивые растения', 'Суккуленты и кактусы', 'Коллекция фикусов',
    'Орхидеи и экзотика', 'Вьющиеся растения', 'Очищающие воздух',
    'Цитрусовые деревья', 'Деревья Бонсай', 'Папоротники и мхи',
    'Редкие ароидные', 'Безопасные для животных', 'Гигантские листья',
    'Насекомоядные растения', 'Офисные настольные', 'Лианы'
];

const adjectives = ['Deep', 'Golden', 'Emerald', 'Velvet', 'Midnight', 'Silver', 'Desert', 'Tropical', 'Royal', 'Wild'];
const botanicalNames = ['Fern', 'Monstera', 'Pothos', 'Ficus', 'ZZ Plant', 'Aloe', 'Cactus', 'Orchid', 'Calathea', 'Philodendron'];
const imageUrl = 'https://i.pinimg.com/1200x/e6/b1/8c/e6b18ce24b4252cc50bd0c19d137a671.jpg';

const seedData = categoriesNames.map(categoryName => {
    const productsCount = Math.floor(Math.random() * 6) + 5; // 5 to 10
    const products = [];

    for (let i = 0; i < productsCount; i++) {
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = botanicalNames[Math.floor(Math.random() * botanicalNames.length)];
        const price = Math.floor(Math.random() * 1500) + 100;
        const stock = Math.floor(Math.random() * 18) + 3; // 3 to 20

        products.push({
            name: `${adj} ${noun} ${Math.floor(Math.random() * 1000)}`,
            description: 'Прекрасный экземпляр для вашей коллекции. Идеально подойдет для любого декора.',
            price,
            costPrice: Math.floor(price * 0.6),
            imageUrl,
            stock
        });
    }

    return {
        name: categoryName,
        products
    };
});

fs.writeFileSync('src/modules/catalog/seed-data.ts', 'export const seedData = ' + JSON.stringify(seedData, null, 2) + ';\n');
console.log('generated src/modules/catalog/seed-data.ts');
