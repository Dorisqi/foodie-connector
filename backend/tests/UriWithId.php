<?php

namespace Tests;

trait UriWithId
{
    /**
     * Id in the uri
     *
     * @var string|int
     */
    protected $id = 0;

    protected function uriParams()
    {
        return [
            'id' => $this->id,
        ];
    }
}
