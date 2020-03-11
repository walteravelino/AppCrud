/**
 * Created by Arif on 15/2/20.
 */
function getQueryParam(criteriaModel){
    if(criteriaModel.findQuery) {
        var cursor = model.find(criteriaModel.findQuery);
        if (criteriaModel.sortByClause) {
            cursor.sort(criteriaModel.sortByClause);
        }
        if (criteriaModel.skipByPage) {
            cursor.skip(criteriaModel.skipByPage);
        }
        if (criteriaModel.limitPageSize) {
            cursor.limit(criteriaModel.limitPageSize);
        }
        return cursor;
    }

}

exports.getQueryParam = getQueryParam;