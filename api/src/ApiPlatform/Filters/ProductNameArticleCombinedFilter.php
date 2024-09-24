<?php
declare(strict_types=1);

namespace App\ApiPlatform\Filters;

use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\AbstractContextAwareFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use App\Entity\Product;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\PropertyInfo\Type;

final class ProductNameArticleCombinedFilter extends AbstractContextAwareFilter
{
    protected function filterProperty(
        string                      $property,
                                    $value,
        QueryBuilder                $queryBuilder,
        QueryNameGeneratorInterface $queryNameGenerator,
        string                      $resourceClass,
        string                      $operationName = null
    ): void
    {
        if ($resourceClass !== Product::class) {
            return;
        }
        if ($property !== 'search') {
            return;
        }

        $parameterName = $queryNameGenerator->generateParameterName($property);
        $alias = $queryBuilder->getRootAliases()[0];
        $queryBuilder
            ->andWhere(sprintf('%s.name LIKE :%s', $alias, $parameterName))
            ->orWhere(sprintf('%s.article LIKE :%s', $alias, $parameterName))
            ->setParameter($parameterName, '%' . $value . '%');
    }

    public function getDescription(string $resourceClass): array
    {
        return [
            'search' => [
                'property' => 'search',
                'type' => Type::BUILTIN_TYPE_STRING,
                'required' => false,
                'description' => 'Search products by name or article',
                'openapi' => [
                    'example' => 'Product',
                    'allowReserved' => false,
                    'allowEmptyValue' => true,
                    'explode' => false,
                ],
            ]
        ];
    }
}
