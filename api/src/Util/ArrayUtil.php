<?php

namespace App\Util;

class ArrayUtil
{
    /**
     * @template T
     * @param T[] $data
     * @param T $defaultValue
     * @return T|null
     */
    public static function findInArray(array &$data, callable $predicate, $defaultValue = null)
    {
        $result = null;
        foreach ($data as $object) {
            if ($predicate($object)) {
                $result = $object;
                break;
            }
        }
        return  $result ?? $defaultValue;
    }

    public static function remove($value, array &$list)
    {
        $idx = array_search($value, $list);
        return array_splice($list, $idx, 1);
    }
}
