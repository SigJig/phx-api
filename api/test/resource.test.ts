
import 'mocha'
import './utils/server'
import _ from 'underscore'
import Chai from 'chai'
import Context from '../src/lib/http/context'
import Resource from '../src/lib/http/resource'
import APIConstants from '../src/lib/constants/api'
import { apply as applyMixin } from '../src/lib/utils/mixins'
import { BadRequest } from '../src/lib/http/errorhandler'
import { APITable } from '../src/database/api'

const expect = Chai.expect

abstract class TestResourceBase extends Resource {
    testStatus: number = 0

    setTestStatus(x: number) {
        this.testStatus = x
    }
}

abstract class TestResourceMixin extends TestResourceBase {
    select_test_fields(this: any, fields: string[]) {
        fields.should.eql(['abc', '123'])

        this.setTestStatus(2)
    }

    select_test_no_fields(this: any, fields: string[]) {
        fields.length.should.equal(0)

        this.setTestStatus(1)
    }
}

class TestTable extends APITable {
    static dbName = 'testtable'
    static fields = {
        id: 'uid',
        test_field_1: 'test_field_one',
        test_field_2: 'test_field_two'
    } as const
}

class TestTable1 extends APITable {
    static dbName = 'testtable_1'
    static fields = {
        test_field_3: 'test_field_three'
    } as const
}

class TestResource extends TestResourceBase {
    get table() { return TestTable }
    get fields() { return ['test_field_1', 'test_field_2'] }
}

function mockContext(req: any = {}, res: any = {}, next: any = () => {}) {
    return new Context(req, res, next)
}

describe('simple resource', () => {
    describe('params', () => {
        describe('select', () => {
            it('should add all fields to local when no select field is supplied', () => {
                function _test(rsc: TestResource) {
                    Object.keys(rsc.selects).length.should.equal(1)
                    rsc.selects.local.should.eql({fields: rsc.fields})
                }

                for (const x of [new TestResource({}, mockContext(), {single: true}), new TestResource({select: []}, mockContext(), {single: true})]) {
                    _test(x)
                }
            })

            it('should add valid fields', () => {
                const [ f1, f2 ] = TestResource.dummy.fields

                const rsc = new TestResource({select: [f1, f2]}, mockContext(), {single: true})
                rsc.selects.local.should.eql({fields: [f1, f2]})
            })

            it('should fail on invalid fields', () => {
                expect(() => new TestResource({select: ['uhhh']}, mockContext(), {single: true})).to.throw(BadRequest)
            })

            it('should add multi-table selects', () => {
                const rsc = new TestResource({}, mockContext(), {single: true})

                rsc.addSelects(['test_field_3'], 'other', TestTable1)

                expect(rsc.selects[TestTable1.dbName]).to.not.equal(undefined)

                _.pick(rsc.selects[TestTable1.dbName], 'aliasTo', 'fields').should.eql(
                    {aliasTo: 'other', fields: ['test_field_3']
                })
            })

            describe('select calbacks', () => {

                class MixinLoaded extends TestResource {  }
                applyMixin(MixinLoaded, TestResourceMixin)

                it('should call valid select_ callback', () => {
                    const rsc = new MixinLoaded({select: ['test_no_fields', 'test_field_2']}, mockContext(), {single: true})
                })

                it('should call valid select_ callback with field arguments', () => {
                    const rsc = new MixinLoaded({select: [['test_fields', ['abc', '123']]]}, mockContext(), {single: true})
                })

                it('should fail on invalid select_ callback', () => {
                    expect(() => new MixinLoaded({select: ['uhhhh']}, mockContext(), {single: true})).to.throw(BadRequest)
                })

                it('should fail with too many callbacks', () => {
                    const limit = APIConstants.selects.maxNested
                    const ctor: any = class extends TestResource {}

                    const callbacks: string[] = []

                    for (let i: number = 0; i < (limit + 1); i++) {
                        let format = `callback_test_${i}`

                        ctor[format] = function () {
                            throw new Error('callback was called')
                        }

                        callbacks.push(format)
                    }

                    expect(() => new ctor({select: callbacks}, mockContext(), {single: true})).to.throw(BadRequest)
                })

            })
        })

        describe('search', () => {
            const onlySearch = {pagination: false, sort: false}

            it('should add a simple search', () => {
                expect(() => new TestResource({search: {id: 3}}, mockContext(), onlySearch)).to.not.throw()
            })

            it('should add a gte opearor', () => {
                expect(() => new TestResource({search: {'id__gte': 3}}, mockContext(), onlySearch)).to.not.throw()
            })

            it('should fail on invalid operator', () => {
                expect(() => new TestResource({search: {'id__uhh': 3}}, mockContext(), onlySearch)).to.throw(BadRequest)
            })
        })
    })
})